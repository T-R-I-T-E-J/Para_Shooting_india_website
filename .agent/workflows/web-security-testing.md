---
description: Web application security testing workflow for OWASP Top 10 vulnerabilities including injection, XSS, authentication flaws, and access control issues.
---

# Web Security Testing Workflow

## Overview
Specialized workflow for testing web applications against OWASP Top 10 vulnerabilities including injection attacks, XSS, broken authentication, and access control issues.

## When to Use This Workflow
Use this workflow when:
- Testing web application security
- Performing OWASP Top 10 assessment
- Conducting penetration tests
- Validating security controls
- Bug bounty hunting

## Workflow Phases

### Phase 1: Reconnaissance
**Skills to Invoke**
- `scanning-tools` - Security scanning
- `top-web-vulnerabilities` - OWASP knowledge

**Actions**
- Map application surface
- Identify technologies
- Discover endpoints
- Find subdomains
- Document findings

**Copy-Paste Prompts**
`Use @scanning-tools to perform web application reconnaissance`

### Phase 2: Injection Testing
**Skills to Invoke**
- `sql-injection-testing` - SQL injection
- `sqlmap-database-pentesting` - SQLMap

**Actions**
- Test SQL injection
- Test NoSQL injection
- Test command injection
- Test LDAP injection
- Document vulnerabilities

**Copy-Paste Prompts**
`Use @sql-injection-testing to test for SQL injection`
`Use @sqlmap-database-pentesting to automate SQL injection testing`

### Phase 3: XSS Testing
**Skills to Invoke**
- `xss-html-injection` - XSS testing
- `html-injection-testing` - HTML injection

**Actions**
- Test reflected XSS
- Test stored XSS
- Test DOM-based XSS
- Test XSS filters
- Document findings

**Copy-Paste Prompts**
`Use @xss-html-injection to test for cross-site scripting`

### Phase 4: Authentication Testing
**Skills to Invoke**
- `broken-authentication` - Authentication testing

**Actions**
- Test credential stuffing
- Test brute force protection
- Test session management
- Test password policies
- Test MFA implementation

**Copy-Paste Prompts**
`Use @broken-authentication to test authentication security`

### Phase 5: Access Control Testing
**Skills to Invoke**
- `idor-testing` - IDOR testing
- `file-path-traversal` - Path traversal

**Actions**
- Test vertical privilege escalation
- Test horizontal privilege escalation
- Test IDOR vulnerabilities
- Test directory traversal
- Test unauthorized access

**Copy-Paste Prompts**
`Use @idor-testing to test for insecure direct object references`
`Use @file-path-traversal to test for path traversal`

### Phase 6: Security Headers
**Skills to Invoke**
- `api-security-best-practices` - Security headers

**Actions**
- Check CSP implementation
- Verify HSTS configuration
- Test X-Frame-Options
- Check X-Content-Type-Options
- Verify referrer policy

**Copy-Paste Prompts**
`Use @api-security-best-practices to audit security headers`

### Phase 7: Reporting
**Skills to Invoke**
- `reporting-standards` - Security reporting

**Actions**
- Document vulnerabilities
- Assess risk levels
- Provide remediation
- Create proof of concept
- Generate report

**Copy-Paste Prompts**
`Use @reporting-standards to create security report`

## OWASP Top 10 Checklist
- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Authentication Failures
- [ ] A08: Software/Data Integrity
- [ ] A09: Logging/Monitoring
- [ ] A10: SSRF

## Quality Gates
- [ ] All OWASP Top 10 tested
- [ ] Vulnerabilities documented
- [ ] Proof of concepts captured
- [ ] Remediation provided
- [ ] Report generated

## Related Workflow Bundles
- `security-audit` - Security auditing
- `api-security-testing` - API security
- `wordpress-security`
