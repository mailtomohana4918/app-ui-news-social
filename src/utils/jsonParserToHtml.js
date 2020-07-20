const htmlTagsEnum = {
  HEADER_TWO: "header-two",
  UNORDERED_LIST: "unordered-list-item",
  ORDERED_LIST: "ordered-list-item",
  UNSTYLED: "unstyled",
  MENTION: "MENTION",
  LINK: "LINK",
};

const styleEnum = {
  BOLD: "BOLD",
  ITALIC: "ITALIC",
  UNDERLINE: "UNDERLINE",
};

export const generateHTMLFromJson = (jsonData) => {
  let result = "";
  let outputHtml = "";
  const { blocks, entityMap } = jsonData;

  if (jsonData.blocks.length === 0) {
    result = "<p>Please provide valid json.";
    return `<article> ${result} </article>`;
  }

  const unSupportedTypes = blocks.filter(
    (el) =>
      el.type !== htmlTagsEnum.HEADER_TWO &&
      el.type !== htmlTagsEnum.UNORDERED_LIST &&
      el.type !== htmlTagsEnum.ORDERED_LIST &&
      el.type !== htmlTagsEnum.UNSTYLED
  );
  if (unSupportedTypes.length > 0) {
    result =
      "<p>Please provide valid text types,parser only supports text types <b>header-two,unstyled,unordered-list-item and ordered-list-item.</b></p>";
    return `<article> ${result} </article>`;
  }

  const listDetails = { unOrderedListPosition: -1, orderedListPosition: -1 };
  blocks.forEach((el) => {
    const { entityRanges, inlineStyleRanges, type, text } = el;
    let htmlText = text;

    //editor support entities
    entityRanges.forEach((entityRange) => {
      const { key, length, offset } = entityRange;
      const data = JSON.stringify(entityMap[key]["data"]);

      const { openTag, closeTag } = htmlOpenCloseTags(
        entityMap[key]["type"],
        data
      );
      htmlText = appendHtmlTags(
        htmlText,
        getIndexPosition(htmlText, offset),
        length,
        openTag,
        closeTag
      );
    });

    inlineStyleRanges.forEach((styleRange) => {
      const { style, length, offset } = styleRange;

      const { openTag, closeTag } = htmlOpenCloseTags(style);

      htmlText = appendHtmlTags(
        htmlText,
        getIndexPosition(htmlText, offset),
        length,
        openTag,
        closeTag
      );
    });

    if (type === htmlTagsEnum.HEADER_TWO) {
      outputHtml = `<h2>${htmlText}</h2>`;
      result = `${result} ${outputHtml}`;
    } else if (type === htmlTagsEnum.UNORDERED_LIST) {
      result = addToList(result, htmlText, listDetails, false);
    } else if (type === htmlTagsEnum.ORDERED_LIST) {
      result = addToList(result, htmlText, listDetails, true);
    } else {
      outputHtml = `<p>${htmlText}</p>`;
      result = `${result} ${outputHtml}`;
    }
  });

  return `<article> ${result} </article>`;
};
// getIndexPosition returns the index to append the tags
const getIndexPosition = (text, offset) => {
  let indexPosition = -1;
  let result = -1;
  let isIndexInStyle = false;

  while (result < offset && indexPosition < text.length) {
    indexPosition++;

    if (text.charAt(indexPosition) === "<") {
      isIndexInStyle = true;
    } else if (text.charAt(indexPosition) === ">") {
      isIndexInStyle = false;

      continue;
    }

    if (!isIndexInStyle) {
      result++;
    }
  }

  return indexPosition;
};
//append the html tags for the given offset and length
const appendHtmlTags = (text, offset, length, htmlOpenTag, htmlCloseTag) => {
  const tagClosePosition = offset + length;
  let result =
    text.substring(0, offset) +
    htmlOpenTag +
    text.substring(offset, tagClosePosition) +
    htmlCloseTag +
    text.substring(tagClosePosition, text.length);

  return result;
};
//addToList append the ul and ol list 
const addToList = (htmlContent, listtest, listDetails, isOrderedList) => {
  const text = `<li>${listtest}</li>`;
  let result = "";
  let replacetEXT = "";

  if (
    (isOrderedList && listDetails.orderedListPosition === -1) ||
    (!isOrderedList && listDetails.unOrderedListPosition === -1)
  ) {
    replacetEXT = isOrderedList ? `<ol>${text}</ol>` : `<ul>${text}</ul>`;
    result = `${htmlContent} ${replacetEXT}`;
    if (isOrderedList) {
      listDetails.orderedListPosition = result.length - 5;
    } else {
      listDetails.unOrderedListPosition = result.length - 5;
    }
  } else {
    result =
      htmlContent.substring(
        0,
        isOrderedList
          ? listDetails.orderedListPosition
          : listDetails.unOrderedListPosition
      ) +
      text +
      htmlContent.substring(
        isOrderedList
          ? listDetails.orderedListPosition
          : listDetails.unOrderedListPosition,
        htmlContent.length
      );
    if (isOrderedList)
      listDetails.orderedListPosition =
        listDetails.orderedListPosition + text.length;
    else
      listDetails.unOrderedListPosition =
        listDetails.unOrderedListPosition + text.length;
  }

  return result;
};
//return html tags for the given input
const htmlOpenCloseTags = (style, data) => {
  let openTag = "";
  let closeTag = "";
  if (style === styleEnum.BOLD) {
    openTag = "<strong>";
    closeTag = "</strong>";
  } else if (style === styleEnum.ITALIC) {
    openTag = "<em>";
    closeTag = "</em>";
  } else if (style === styleEnum.UNDERLINE) {
    openTag = '<span class="underline">';
    closeTag = "</span>";
  } else if (style === htmlTagsEnum.MENTION) {
    openTag = `<Mention data={${data}}>`;
    closeTag = `</Mention>`;
  } else if (style === htmlTagsEnum.LINK) {
    openTag = `<Link data={${data}}>`;
    closeTag = `</Link>`;
  }
  return { openTag: openTag, closeTag: closeTag };
};
