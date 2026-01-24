import { useState } from "react";
import { Playground } from "./Playground";
import { EXAMPLES } from "./examples";

export default function App() {
  const [query, setQuery] = useState(
    () => sessionStorage.getItem("morph_query") || EXAMPLES[0].query,
  );
  const [sourceData, setSourceData] = useState(
    () => sessionStorage.getItem("morph_source") || EXAMPLES[0].source,
  );

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    sessionStorage.setItem("morph_query", newQuery);
  };

  const handleSourceDataChange = (newData: string) => {
    setSourceData(newData);
    sessionStorage.setItem("morph_source", newData);
  };

  return (
    <div className="h-screen w-screen">
      <Playground
        initialQuery={query}
        initialSourceData={sourceData}
        onQueryChange={handleQueryChange}
        onSourceDataChange={handleSourceDataChange}
      />
    </div>
  );
}
