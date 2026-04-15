import paramiko

HOSTNAME = '68.178.164.93'
USERNAME = 'webtesters'
PASSWORD = 'Five01@123'

LOCAL_PAGE = r'c:\Users\trite\Documents\test\results_final\apps\web\src\app\(public)\media\page.tsx'
LOCAL_IMG_1 = r'c:\Users\trite\Documents\test\results_final\apps\web\public\course\DSC00530.JPG'
LOCAL_IMG_2 = r'c:\Users\trite\Documents\test\results_final\apps\web\public\course\DSC00524.JPG'

REMOTE_APP_DIR = '/home/webtesters/para-shooting-india/apps/web'
REMOTE_PAGE = f'{REMOTE_APP_DIR}/src/app/(public)/media/page.tsx'
REMOTE_COURSE_DIR = f'{REMOTE_APP_DIR}/public/course'
REMOTE_IMG_1 = f'{REMOTE_COURSE_DIR}/DSC00530.JPG'
REMOTE_IMG_2 = f'{REMOTE_COURSE_DIR}/DSC00524.JPG'

def deploy():
    print(f"Connecting to {HOSTNAME}...")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(HOSTNAME, username=USERNAME, password=PASSWORD)
        print("Connected successfully.")

        sftp = ssh.open_sftp()
        
        # Create directory
        print(f"Ensuring {REMOTE_COURSE_DIR} exists...")
        try:
            sftp.stat(REMOTE_COURSE_DIR)
        except IOError:
            sftp.mkdir(REMOTE_COURSE_DIR)
        
        # Upload images
        print(f"Uploading {LOCAL_IMG_1} to {REMOTE_IMG_1}")
        sftp.put(LOCAL_IMG_1, REMOTE_IMG_1)
        print(f"Uploading {LOCAL_IMG_2} to {REMOTE_IMG_2}")
        sftp.put(LOCAL_IMG_2, REMOTE_IMG_2)
        
        # Upload page
        print(f"Uploading {LOCAL_PAGE} to {REMOTE_PAGE}")
        sftp.put(LOCAL_PAGE, REMOTE_PAGE)
        sftp.close()

        # Build and restart PM2
        print("Running build and restart on the server...")
        commands = [
            f"cd {REMOTE_APP_DIR} && npm run build",
            f"cd {REMOTE_APP_DIR} && pm2 restart para-web"
        ]
        
        for cmd in commands:
            print(f"Executing: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd)
            print(stdout.read().decode())
            err = stderr.read().decode()
            if err:
                print(f"Error: {err}")

        ssh.close()
        print("Deployment complete.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    deploy()
