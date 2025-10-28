#!/usr/bin/env python3
"""
Script to update MFU Navy colors to Red colors in all TypeScript/TSX files
"""

import os
import re

# Color mapping
COLOR_MAP = {
    '#002D72': '#DC2626',  # Navy → Red
    '#0a4a9d': '#EF4444',  # Navy Light → Red Light
    '#001d4a': '#991B1B',  # Navy Dark → Red Dark
}

def update_colors_in_file(filepath):
    """Update colors in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace each color
        for old_color, new_color in COLOR_MAP.items():
            content = content.replace(old_color, new_color)
        
        # Check if any changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to update all files"""
    # Directories to process
    directories = [
        'components',
        'app',
        '.'  # Root directory for App.tsx
    ]
    
    # File extensions to process
    extensions = ('.tsx', '.ts')
    
    updated_files = []
    
    print("🎨 Starting color update process...")
    print(f"Color mapping:")
    for old, new in COLOR_MAP.items():
        print(f"  {old} → {new}")
    print()
    
    for directory in directories:
        if not os.path.exists(directory):
            continue
            
        if directory == '.':
            # Process root files only
            for filename in os.listdir(directory):
                if filename.endswith(extensions) and os.path.isfile(filename):
                    if update_colors_in_file(filename):
                        updated_files.append(filename)
                        print(f"✅ Updated: {filename}")
        else:
            # Process directory recursively
            for root, dirs, files in os.walk(directory):
                # Skip node_modules
                if 'node_modules' in dirs:
                    dirs.remove('node_modules')
                
                for filename in files:
                    if filename.endswith(extensions):
                        filepath = os.path.join(root, filename)
                        if update_colors_in_file(filepath):
                            updated_files.append(filepath)
                            print(f"✅ Updated: {filepath}")
    
    print()
    print(f"🎉 Complete! Updated {len(updated_files)} files:")
    for filepath in updated_files:
        print(f"  - {filepath}")
    
    if not updated_files:
        print("ℹ️  No files needed updating (all colors already updated)")

if __name__ == '__main__':
    main()
