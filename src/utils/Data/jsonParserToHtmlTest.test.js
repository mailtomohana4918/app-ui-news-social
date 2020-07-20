import taskOneJson from "./taskoneJson.json";
import tasktwoJson from "./tasktwoJson.json";
import taskThreeJson from "./taskThreeJson.json";
import jsonWithInvalidTypes from "./jsonWithInvalidTypes.json";
import invalidJson from "./invalidJson.json";
import { generateHTMLFromJson } from "../jsonParserToHtml";
describe("test jsonParserToHtml", () => {
  describe("Task one", () => {
    const expected = `<article>  <h2>This is a Title</h2> <p>This is a paragraph, with some inline styles such as <strong>bold</strong>, <em>italic</em>, and <span class="underline">underline</span>.</p> <p>Styles can overlap, like this: <strong><em>bold and italic</em></strong>, <strong><em><span class="underline">bold, italic, and underline</span></em></strong>.</p> <p>Style overlaps do not have to start or end at the same place, for example: <span class="underline">one, <em>two, <strong>three</strong>, two</em>, one</span>.</p> </article>`;
    it("return html for the given json contains header and p tags with styles", () => {
      const actual = generateHTMLFromJson(taskOneJson);
      expect(actual).toEqual(expected);
    });
  });

  describe("Task two", () => {
    const expected = `<article>  <p>We can have bullet-point lists:</p> <ul><li>bullets</li><li>are</li><li>useful</li></ul> <p>And numbered lists:</p> <ol><li>numbers</li><li>are</li><li>fun</li></ol> </article>`;
    it("return html for the given json contains unordered and ordered list", () => {
      const actual = generateHTMLFromJson(tasktwoJson);

      expect(actual).toEqual(expected);
    });
  });

  describe("Task three", () => {
    const expected = `<article>  <p>We can mention people like <Mention data={{"img":{"_id":"59d785576a02553c4109c8ce","contentType":"image/png","originalFileSize":2271,"originalFileName":"avatar.png","uuid":"734114e0-aa9a-11e7-8f69-831ae15637d2"},"text":"steve-kv","id":"59d785576a02553c4109c8cd"}}>@steve-kv</Mention> and <Link data={{"description":"This is a link to Google","url":"http://www.google.com"}}>link to url's</Link>.</p> </article>`;
    it("return html for the given json contains mention and link tags", () => {
      const actual = generateHTMLFromJson(taskThreeJson);
      expect(actual).toEqual(expected);
    });
  });

  describe("json with invalid type", () => {
    const expected = `<article> <p>Please provide valid text types,parser only supports text types <b>header-two,unstyled,unordered-list-item and ordered-list-item.</b></p> </article>`;
    it("return html with parent tags contains support text types", () => {
      const actual = generateHTMLFromJson(jsonWithInvalidTypes);

      expect(actual).toEqual(expected);
    });
  });

  describe("invalid json", () => {
    const expected = `<article> <p>Please provide valid json. </article>`;
    it("return html with parent tags contains support text types", () => {
      const actual = generateHTMLFromJson(invalidJson);
      expect(actual).toEqual(expected);
    });
  });
});
