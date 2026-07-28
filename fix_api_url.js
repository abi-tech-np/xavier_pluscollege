const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            if (filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
                filelist.push(filepath);
            }
        }
    });
    return filelist;
};

const files = walkSync(path.join(__dirname, 'client', 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace 'API_URL_BASE/...' or "API_URL_BASE/..." with `${import.meta.env.VITE_API_URL}/...`
    const regex1 = /['"]API_URL_BASE(.*?)['"]/g;
    if (regex1.test(content)) {
        content = content.replace(regex1, '`${import.meta.env.VITE_API_URL}$1`');
        changed = true;
    }

    // Replace `API_URL_BASE/...` with `${import.meta.env.VITE_API_URL}/...`
    const regex2 = /`API_URL_BASE(.*?)`/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, '`${import.meta.env.VITE_API_URL}$1`');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
