import { FC } from "react";

import { AiFillReconciliation } from "react-icons/ai";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home: FC = () => {
  return (
    <div className="flex w-full flex-col justify-center bg-white">
      <Card className="w-[90vw] max-w-[400px]">
        <CardHeader className="flex flex-col items-center justify-center">
          <AiFillReconciliation size={64} />
          <CardTitle className="mt-4 text-2xl font-bold">¡Bienvenido a tu App!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">adsjhsaj</CardContent>
      </Card>
    </div>
  );
};

export default Home;
