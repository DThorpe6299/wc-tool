#!/usr/bin/env node

const fs = require('fs/promises');
const { Command } = require('commander');
const program = new Command();

program
    .option('-l, --lines', 'count the lines in a file')
    .option('-w, --words', 'count the words in a file')
    .option('-m, --chars', 'count the characters in a file')
    .option('-c, --bytes', 'count the bytes in a file');

program.parse(process.argv);

// Default file if none is provided
const filePath = program.args[0] || 'test.txt';

async function getFileSize(filePath) {
    try {
        const stats = await fs.stat(filePath);
        console.log("Byte count:", stats.size)
    } catch (error) {
        console.error('Error getting file size:', error);
        process.exit(1)
    }
}

async function getLinesCount(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8')
        const lineCount = data.split('\n').length - 1;
        console.log("Lines count:", lineCount)
    } catch (error) {
        console.error('Error reading file:', error)
        process.exit(1);
    }
}


async function countWords(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const wordCount = data.split(/\s+/).filter(Boolean).length;
        console.log('Word count:', wordCount);
    } catch (err) {
        console.error('Error reading file:', err);
        process.exit(1)
    }
}

async function countChars(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        const charCount = [...data].length;
        console.log("Character count:", charCount);
    } catch (error) {
        console.error('Error reading file', error)
        process.exit(1)
    }
}

(async () => {
    const options = program.opts();

    const noFlags = Object.keys(options).length === 0;

    // Run based on flags or default to all
    try {
        console.log(`Processing file: ${filePath}`)
        if (options.lines || noFlags) await getLinesCount(filePath);
        if (options.words || noFlags) await countWords(filePath);
        if (options.chars || noFlags) await countChars(filePath);
        if (options.bytes || noFlags) await getFileSize(filePath);
    } catch (err) {
        console.error(err)
    }
})();