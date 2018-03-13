/* jslint esnext: true */

import TagRelativeFormat from './core';
import defaultLocale from './en';

TagRelativeFormat.__addLocaleData(defaultLocale);
TagRelativeFormat.defaultLocale = 'en';

export default TagRelativeFormat;
