#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node tagshow.js <html-file> <id1> [id2] [id3] ...');
  console.error('Example: node tagshow.js index.html header content footer');
  process.exit(1);
}

const inputFile = process.argv[2];
const targetIds = process.argv.slice(3);

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File '${inputFile}' not found`);
  process.exit(1);
}

const htmlContent = fs.readFileSync(inputFile, 'utf8');
function parseHTML(html) {
  const tokens = [];
  const regex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>|[^<]+/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

function getAttributes(tagString) {
  const attrs = {};
  const attrRegex = /(\w+)=["']([^"']*)["']/g;
  let match;
  while ((match = attrRegex.exec(tagString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function isOpeningTag(token) {
  return /^<[a-zA-Z][a-zA-Z0-9]*[^>]*>$/.test(token) && !token.startsWith('</');
}

function isClosingTag(token) {
  return /^<\/[a-zA-Z][a-zA-Z0-9]*>$/.test(token);
}

function getTagName(token) {
  const match = token.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/);
  return match ? match[1].toLowerCase() : null;
}

function filterHTML(html, targetIds) {
  const tokens = parseHTML(html);
  const result = [];
  const tagStack = [];
  let inSpecialElement = 0;
  const idSet = new Set(targetIds);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (isOpeningTag(token)) {
      const tagName = getTagName(token);
      const attrs = getAttributes(token);
      const hasTargetId = attrs.id && idSet.has(attrs.id);
      // Always keep html, body, head, and style tags, or tags within special elements
      const shouldKeep = tagName === 'html' || tagName === 'body' || 
                        tagName === 'head' || tagName === 'style' ||
                        hasTargetId || inSpecialElement > 0;
      tagStack.push({
        name: tagName,
        keep: shouldKeep,
        isSpecial: hasTargetId
      });
      if (hasTargetId) {
        inSpecialElement++;
      }
      if (shouldKeep) {
        result.push(token);
      }
    } else if (isClosingTag(token)) {
      const tagName = getTagName(token);
      // Find matching opening tag
      let matchingTag = null;
      for (let j = tagStack.length - 1; j >= 0; j--) {
        if (tagStack[j].name === tagName) {
          matchingTag = tagStack[j];
          tagStack.splice(j, 1);
          break;
        }
      }
      if (matchingTag) {
        if (matchingTag.isSpecial) {
          inSpecialElement--;
        }
        if (matchingTag.keep) {
          result.push(token);
        }
      }
    } else {
      const currentTags = tagStack.map(t => t.name);
      const inPreservedTag = currentTags.includes('html') || 
                            currentTags.includes('body') || 
                            currentTags.includes('head') || 
                            currentTags.includes('style');
      if (inSpecialElement > 0 || inPreservedTag) {
        // Keep text if we're inside a special element or preserved tags
        if (inSpecialElement > 0 || tagStack.length <= 3 || currentTags.includes('style')) {
          result.push(token);
        }
      }
    }
  }
  return result.join('');
}

const parsedPath = path.parse(inputFile);
const outputFile = path.join(
  parsedPath.dir,
  `${parsedPath.name}_modified${parsedPath.ext}`
);

const filteredHTML = filterHTML(htmlContent, targetIds);
fs.writeFileSync(outputFile, filteredHTML, 'utf8');

console.log(`Processed ${inputFile}. Kept: ${targetIds.join(', ')}`);
console.log(`Output: ${outputFile}`);
