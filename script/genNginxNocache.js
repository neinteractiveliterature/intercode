fs=require('fs');

for (const fname of JSON.parse(fs.readFileSync("config/nocache-files.json"))) {
    process.stdout.write(
        `location ${fname} { add_header "Cache-Control" "no-cache"; }\n`
    );
}
