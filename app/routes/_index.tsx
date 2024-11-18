import type { MetaFunction } from "@netlify/remix-runtime";

export const meta: MetaFunction = () => {
  return [
    { title: "SBK Events" },
    { name: "description", content: "salsa bachata and kizomba events" },
    { name: "keywords", content: "salsa events, bachata events, kizomba events, salsa dance, bachata dance, kizomba dance, salsa festivals, bachata festivals, kizomba festivals, salsa parties, bachata parties, kizomba parties, salsa workshops, bachata workshops, kizomba workshops" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen v-screem" style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="m-auto text-center flex flex-col gap-2">
      <h1 className="text-white text-3xl">Worldwide salsa, bachata and kizomba events!</h1>
      <h2 className="text-gray-400 text-2xl m-auto">Coming soon...</h2>
      </div>
    </div>
  );
}
