import paramiko
import os

# Server details
HOSTNAME = '68.178.164.93'
USERNAME = 'webtesters'
PASSWORD = 'Five01@123'
REMOTE_PATH = 'apps/web/src/app/(public)/about/page.tsx' # Assuming relative path from home, acting as a guess first
LOCAL_PATH = r'c:\Users\trite\Documents\test\results_final\apps\web\src\app\(public)\about\page.tsx'

def deploy():
    print(f"Connecting to {HOSTNAME}...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOSTNAME, username=USERNAME, password=PASSWORD)
        print("Connected successfully.")

        # Read local file content
        with open(LOCAL_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        # We need to find the absolute path on the server.
        # Let's try to find the file first.
        print("Locating remote file...")
        stdin, stdout, stderr = ssh.exec_command(f'find . -name page.tsx | grep "about/page.tsx"')
        found_paths = stdout.read().decode().strip().split('\n')
        
        target_path = None
        if found_paths and found_paths[0]:
            # Use the first match that looks like our structure
            for p in found_paths:
                if 'apps/web/src/app/(public)/about/page.tsx' in p:
                    target_path = p
                    break
            if not target_path:
                target_path = found_paths[0] # Fallback
        
        if not target_path:
            print("Could not locate the file structure on the server. Defaulting to exact match attempt or failing.")
            # Try a standard guess if find failed or returned nothing useful immediately
            # But let's verify if we can just write to a likely path
            # For now, let's try to overwrite assuming the folder structure mirrors the repo name or similar. 
            # Often it's in ~/apps/web... or ~/project_name/apps/web...
            # Let's list directories to guess
            stdin, stdout, stderr = ssh.exec_command('ls -F')
            dirs = stdout.read().decode()
            print(f"Root directories: {dirs}")
            return

        print(f"Targeting remote file: {target_path}")
        
        # Use SFTP to upload
        sftp = ssh.open_sftp()
        sftp.put(LOCAL_PATH, target_path)
        sftp.close()
        print("File uploaded successfully.")

        # Check if we need to rebuild
        # This part depends on how the app is run. 
        # I'll check for package.json in the root of the find result
        # remote_app_dir = os.path.dirname(target_path).split('apps/web')[0]
        # print(f"Checking for build scripts in {remote_app_dir}")
        # ... logic to rebuild if needed ...
        
        print("Update complete. You may need to restart the application manually if it does not hot-reload.")

        ssh.close()

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    deploy()
