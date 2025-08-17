const { input, select } = require('@inquirer/prompts');
const { execSync } = require('child_process');

function getLatestTag() {
    try {
        execSync('git fetch --tags', { stdio: 'inherit' });

        const tags = execSync('git tag -l --sort=-v:refname', { encoding: 'utf-8' })
            .trim()
            .split('\n')
            .filter(Boolean); // Remove any empty lines

        if (tags.length === 0) {
            console.warn('No tags found. Using v0.0.0 as the base version.');
            return 'v0.0.0';
        }

        return tags[0];
    } catch (error) {
        console.error('Error fetching or listing tags:', error.message);
        return 'v0.0.0';
    }
}

function incrementVersion(version, bumpType) {
    const parts = version.slice(1).split('.').map(Number);
    let [major, minor, patch] = parts;

    // Validate the parts
    if ([major, minor, patch].some(isNaN)) {
        console.warn(`Invalid version parsed: ${version}. Defaulting to v0.0.0`);
        major = 0;
        minor = 0;
        patch = 0;
    }

    switch (bumpType) {
        case 'major':
            return `v${major + 1}.0.0`;
        case 'minor':
            return `v${major}.${minor + 1}.0`;
        case 'patch':
            return `v${major}.${minor}.${patch + 1}`;
        default:
            return version;
    }
}

async function createTag() {
    try {
        const latestTag = getLatestTag();
        console.log(`Latest tag found: ${latestTag}`);

        const majorVersion = incrementVersion(latestTag, 'major');
        const minorVersion = incrementVersion(latestTag, 'minor');
        const patchVersion = incrementVersion(latestTag, 'patch');

        const bumpType = await select({
            message: 'Select version bump type:',
            choices: [
                { name: `major (${majorVersion})`, value: majorVersion },
                { name: `minor (${minorVersion})`, value: minorVersion },
                { name: `patch (${patchVersion})`, value: patchVersion },
                { name: 'other (enter manually)', value: 'other' },
            ],
        });

        let newTag = bumpType;

        if (bumpType === 'other') {
            newTag = await input({
                message: 'Enter custom version tag (e.g., v1.10.15):',
                validate: (val) => /^v\d+\.\d+\.\d+$/.test(val)
                    ? true
                    : 'Invalid format. Use vX.Y.Z',
            });
        }

        execSync(`git tag ${newTag}`, { stdio: 'inherit' });
        console.log(`Tag created: ${newTag}`);

        execSync(`git push origin ${newTag}`, { stdio: 'inherit' });
        console.log(`Tag pushed to remote: ${newTag}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

createTag();