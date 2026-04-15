import paramiko
import time

# Server details
HOSTNAME = '68.178.164.93'
USERNAME = 'webtesters'
PASSWORD = 'Five01@123'

def execute_remote_commands():
    print(f"Connecting to {HOSTNAME}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)
        print("Connected successfully.")
        
        shell = client.invoke_shell()
        
        def send_and_read(cmd, wait_time=5):
            print(f"Sending: {cmd}")
            shell.send(cmd + '\n')
            time.sleep(wait_time)
            out = ""
            while shell.recv_ready():
                out += shell.recv(9999).decode()
            print(out)
            return out

        # Navigate to the project root or web app
        # We know the file path: .../apps/web/src/app/(public)/about/page.tsx
        # Let's find where apps/web is
        
        send_and_read("find ~ -type d -name 'web' | grep 'apps/web'")
        
        # We'll try to cd into the first match that looks like our app
        # This is a safer bet than relative paths
        shell.send("cd $(find ~ -type d -name 'web' | grep 'apps/web' | head -n 1)\n")
        time.sleep(2)
        out = send_and_read("pwd")
        
        if "apps/web" not in out:
            print("Could not navigate to apps/web. Trying to find root.")
            shell.send("cd ~/para-shooting-india/apps/web\n") # direct guess based on previous output
            send_and_read("pwd")

        # Now in apps/web, let's try to build
        print("Building the application...")
        shell.send("npm install && npm run build\n")
        
        # Wait for build to complete
        # This can take time. We loop and print output.
        for _ in range(20): # 100 seconds max
            time.sleep(5)
            if shell.recv_ready():
                print(shell.recv(9999).decode())
        
        print("Restarting PM2...")
        send_and_read("pm2 restart all")
        send_and_read("pm2 list")
        send_and_read("pm2 save")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == '__main__':
    execute_remote_commands()
