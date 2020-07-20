import { render } from "@testing-library/react";
import React from "react";
import { Task } from "./Task";


describe("Test Component", () => {
  it("renders as expected", () => {
    const { asFragment } = render(<Task/>);
    expect(asFragment()).toMatchSnapshot();
  });
});

