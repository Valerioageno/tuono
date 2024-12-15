import React, { Suspense, type JSX } from "react";
import "tuono";
import DynamicComponent from "../components/DynamicComponent";
const Loading = () => <>Loading</>;
export default function IndexPage(): JSX.Element {
  return <Suspense fallback={<Loading />}>
			<DynamicComponent />
		</Suspense>;
}