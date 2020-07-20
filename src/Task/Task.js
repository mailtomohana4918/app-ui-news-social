import React from "react";
import taskOneJson from "../utils/Data/taskoneJson.json";
import tasktwoJson from "../utils/Data/tasktwoJson.json";
import taskThreeJson from "../utils/Data/taskThreeJson.json";
import { generateHTMLFromJson } from "../utils/jsonParserToHtml";

export const Task = () => {
  return (
    <>
      <h3>Task One</h3>
      {generateHTMLFromJson(taskOneJson)}
      <h3>Task Two</h3>
      {generateHTMLFromJson(tasktwoJson)}
      <h3>Task Three</h3>
      {generateHTMLFromJson(taskThreeJson)}
    </>
  );
};
