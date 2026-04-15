import os
import shutil
import zipfile

def zip_project(output_filename):
    # Directories and files to exclude
    exclude_dirs = {
        'node_modules', '.git', '.next', 'dist', 
        'build', '.deploy_venv', 'test_results', 
        'playwright-report', 'coverage', '.ipynb_checkpoints',
        '__pycache__', '.qodo'
    }
    
    # Create a ZipFile object
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Traverse the directory tree
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                # Exclude specific large files or extensions if needed
                if file.endswith('.tar.gz') or file.endswith('.zip'):
                    continue
                if file in ['.DS_Store', 'Thumbs.db']:
                    continue
                
                file_path = os.path.join(root, file)
                # Keep directory structure relative to current directory
                arcname = os.path.relpath(file_path, start='.')
                
                # Check file size (optional check to avoid huge files)
                if os.path.getsize(file_path) > 50 * 1024 * 1024: # Skip > 50MB
                    print(f"Skipping large file: {file_path}")
                    continue
                
                zipf.write(file_path, arcname)
                
    print(f"Created {output_filename}")

if __name__ == "__main__":
    zip_project("deploy_package.zip")
