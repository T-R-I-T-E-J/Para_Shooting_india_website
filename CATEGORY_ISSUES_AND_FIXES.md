# Technical Handover: System-Wide Category Architecture Fixes

**To:** Backend/Full-Stack Developer
**From:** Architecture Audit Team
**Date:** 2026-02-05
**Subject:** Resolving Architecture Inconsistencies in `Results` and `Downloads` Modules

---

## 1. Executive Summary & Problem Statement
The application currently suffers from a "Split Brain" architecture regarding how logical categories are handled.
1.  **Results Module**: Completely disconnected from the central `Category` entity. Features relating to "National" vs "International" results cannot be implemented.
2.  **Downloads Module**: Uses a hybrid approach (legacy string column + new relation), causing potential data integrity issues.

This document details the **exact code changes** required to standardize the architecture.

---

## 2. Critical Fix: Results Module

**Severity:** HIGH
**Goal:** Enable `Results` to be categorized using the central `categories` table, while keeping them distinct from "Classification" or "Policy" categories.

### 2.1 Database & Entity Changes
**File:** `apps/api/src/results/entities/result.entity.ts`

**Action:** Add the `ManyToOne` relationship.

```typescript
// Import Category
import { Category } from '../../categories/entities/category.entity';

@Entity('results')
export class Result {
  // ... existing columns

  // [NEW] Add relationship
  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // [NEW] Add column for direct access
  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string;
}
```

*Migration Note:* This requires a schema migration: `ALTER TABLE "results" ADD "category_id" uuid;` plus FK constraint.

### 2.2 DTO Updates
**File:** `apps/api/src/results/dto/upload-result.dto.ts`

**Action:** Allow client to send `categoryId`.

```typescript
export class UploadResultDto {
  // ... existing fields

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
```

**File:** `apps/api/src/results/dto/result-response.dto.ts`

**Action:** Return category details.

```typescript
export class ResultResponseDto {
  // ... existing fields
  
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}
```

### 2.3 Service Logic (The "Page Type" Enforcement)
**File:** `apps/api/src/results/services/results.service.ts`

**Action 1:** Validate category on upload. **CRITICAL:** Ensure the category belongs to `page='results'`.

```typescript
// In uploadResult method:
if (uploadDto.categoryId) {
  const category = await this.categoryRepository.findOne({ 
    where: { id: uploadDto.categoryId } 
  });
  
  if (!category) throw new BadRequestException('Invalid category ID');
  
  // [CRITICAL] Prevent linking to 'classification' or 'policies' categories
  if (category.page !== 'results') {
    throw new BadRequestException('Selected category is not valid for Results.');
  }
}
```

**Action 2:** Join category in `findAll`.

```typescript
async findAll(): Promise<ResultResponseDto[]> {
  const results = await this.resultRepository.find({
    where: { is_published: true, is_deleted: false },
    order: { created_at: 'DESC' },
    relations: ['category'] // [NEW] Fetch relation
  });

  return results.map(this.mapToResponseDto);
}
```

---

## 3. Standardization: Downloads Module

**Severity:** MEDIUM
**Goal:** Prevent downloads from accidentally appearing in inappropriate sections by enforcing the `page` attribute.

**File:** `apps/api/src/downloads/downloads.service.ts`

**Action:** Update retrieval logic to ensure strict filtering.

```typescript
// Current Issue: Only checks 'isActive'. 
// New Logic: Should check category connection.

async create(createDownloadDto: CreateDownloadDto) {
  // ...
  if (createDownloadDto.categoryId) {
    const category = await this.categoriesService.findOne(createDownloadDto.categoryId);
    
    // [NEW] Safety Check
    const allowedPages = ['classification', 'downloads', 'policies'];
    if (!allowedPages.includes(category.page)) {
       throw new BadRequestException(`Category type '${category.page}' not allowed for downloads.`);
    }
  }
  // ...
}
```

---

## 4. Frontend Implementation

**File:** `apps/web/src/app/(public)/results/page.tsx`

**Action:** Display the category badge.

```tsx
// Inside result map loop:
{result.category && (
  <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold text-white bg-primary rounded-full">
    {result.category.name}
  </span>
)}
```

---

## 5. Verification Checklist

1.  **Schema Check**:
    -   Connect to DB.
    -   Run `\d results` (Postgres).
    -   Confirm `category_id` exists and has Foreign Key to `categories.id`.

2.  **API Test (Curl)**:
    ```bash
    # 1. Create a "Results" category
    curl -X POST /api/v1/categories -d '{"name":"National", "page":"results", "slug":"national"}'
    
    # 2. Upload Result linked to it
    curl -X POST /api/v1/results/upload -F "file=@test.pdf" -F "categoryId=<ID_FROM_STEP_1>"
    ```

3.  **Negative Test**:
    -   Try to upload a Result linked to a "Classification" category (where `page='classification'`). 
    -   Server MUST respond `400 Bad Request`.

---
**End of Document**
