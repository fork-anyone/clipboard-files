#!/usr/bin/env python3
import os
import sys
import zipfile
import glob

root   = sys.argv[1]       # <(PRODUCT_DIR)
module = sys.argv[2]       # <(module_name)
outdir = sys.argv[3]       # <(module_path)
arch   = sys.argv[4]       # <(target_arch)
osname = sys.argv[5]       # <(OS)

zip_path = os.path.join(outdir, f"{module}.node.dSYM.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    # macOS dSYM 目录
    for d in glob.glob(os.path.join(root, "*.dSYM")):
        for dirpath, _, files in os.walk(d):
            for f in files:
                full = os.path.join(dirpath, f)
                zf.write(full, os.path.relpath(full, root))
    # Windows .pdb
    for pdb in glob.glob(os.path.join(root, "*.pdb")):
        zf.write(pdb, os.path.basename(pdb))
    # Linux .debug / .dbg
    for dbg in glob.glob(os.path.join(root, "*.debug")) + \
               glob.glob(os.path.join(root, "*.dbg")):
        zf.write(dbg, os.path.basename(dbg))