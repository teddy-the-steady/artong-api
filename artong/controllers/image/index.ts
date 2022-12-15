import * as profile from './profile';
import * as content from './content';
import * as project from './project';

const makeDstKeyWithResizedFileName = function(srcKey: string) {
  const items = srcKey.split('/');
  let fileName = items[items.length - 1];
  fileName = 'resized-' + fileName;
  items[items.length - 1] = fileName;

  items.splice(1, 0, 'thumbnails');

  return items.join('/')
}

export {
	makeDstKeyWithResizedFileName,
	profile,
	content,
  project,
};