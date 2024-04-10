export default (context, inject) => {
  const cleanText = (text, extraPatterns = []) => {
    const basePattern = /<pb\/>|<f>.*?<\/f>|<t>|<\/t>|<br\/>|<x>.*?<\/x>|<font size=-1>|<\/font>|<i>.*?<\/i>/g;
    let finalPattern = basePattern;
    
    if (extraPatterns.length) {
      finalPattern = new RegExp(`${basePattern.source}|${extraPatterns.join('|')}`, 'g');
    }
    
    return text.replace(finalPattern, '').replace(/\s{2,}/g, ' ');
  };

  const changeTags = (text) => {
    const styledText = text.replace(/<J>(.*?)<\/J>/g, '<span class="j-tag">$1</span>');
    return cleanText(styledText);
  };

  const removeTags = (text) => {
    return cleanText(text, [/|<J>|<\/J>/g]);
  };

  const removeTagsTitle = (text) => {
    return cleanText(text, [/|<J>|<\/J>|—|;|,/g]);
  };

  inject('changeTags', changeTags);
  inject('removeTags', removeTags);
  inject('removeTagsTitle', removeTagsTitle);
};
