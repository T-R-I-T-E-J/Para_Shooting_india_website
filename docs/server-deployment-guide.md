# Server Deployment Guide

This document outlines the fastest, most efficient approach to deploying incremental updates to the production server (IP: `68.178.164.93`). Following these steps reduces context and token usage for AI assistants when applying updates.

## Server Details

- **IP Address:** `68.178.164.93`
- **Username:** `webtesters`
- **Password:** `Five01@123`
- **Application Root Directory:** `/home/webtesters/para-shooting-india`
- **Web App Directory:** `/home/webtesters/para-shooting-india/apps/web`
- **API App Directory:** `/home/webtesters/para-shooting-india/apps/api`

---

## Deployment Process (Incremental Updates)

To push changes to the server rapidly:

### Step 1: Tar the Target Files Locally

Identify the files you modified (or media files you added) and create a tar archive in the local project root.

```bash
# Example: Adding a page update and images
tar -cf update.tar "apps/web/src/app/(public)/media/page.tsx" "apps/web/public/course/DSC00530.JPG" "apps/web/public/course/DSC00524.JPG"
```

### Step 2: SCP the Archive to the Server

Transfer the tar file to the remote server root application directory.

```bash
scp update.tar webtesters@68.178.164.93:/home/webtesters/para-shooting-india/
```

_Note: You will be prompted for the password `Five01@123`._

### Step 3: Run Remote Build and Restart Command via SSH

SSH into the server, unpack the modified files securely into the application's root directory, rebuild the Next.js app, and restart PM2—all in a single consolidated command string.

```bash
ssh webtesters@68.178.164.93 'cd /home/webtesters/para-shooting-india && tar -xvf update.tar && cd apps/web && npm install && npm run build && pm2 restart para-web'
```

_Note: You will be prompted for the password `Five01@123` again._

### API Service Updates

If the changes were strictly in the backend REST API (`apps/api`):

```bash
ssh webtesters@68.178.164.93 'cd /home/webtesters/para-shooting-india && tar -xvf update.tar && cd apps/api && npm install && npm run build && pm2 restart para-api'
```

---

## Agent Protocol

If the USER asks the AI agent to deploy the current changes to the server:

1. **Gather files:** List all the modified files internally.
2. **Execute (`run_command` in the background):** Create the `.tar` archive locally.
3. **Wait & Upload:** Start the `scp` command in the background, check its status, then send the password via `send_command_input`.
4. **Deploy & Build:** Start the `ssh` build command, supply the password again via `send_command_input`. Wait until the Next.js build (`pm2 restart`) process outputs a successful exit code `0`.
