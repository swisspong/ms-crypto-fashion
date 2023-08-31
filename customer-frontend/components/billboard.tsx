import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface BillboardProps {
  name?: string;
  info: IMerchant | undefined;
}

const Billboard: React.FC<BillboardProps> = ({ name, info }) => {
  console;
  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
      <div
        style={{
          backgroundImage: `url(${
            info?.banner_url
              ? info.banner_url
              : "https://static.vecteezy.com/system/resources/previews/002/563/549/original/white-3d-pedestal-background-with-realistic-palm-leaves-for-cosmetic-product-presentation-or-fashion-magazine-free-vector.jpg"
          })`,
        }}
        className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
      >
        <Alert className="col-span-2 flex items-center space-x-4 bg-transparent border-none absolute">
          {/* <div className="rounded-full h-14 w-14 border flex items-center justify-center bg-slate-100">
            img
          </div> */}
          {/* <Terminal className="h-4 w-4" /> */}
          <div>
            <AlertTitle className="underline">
              {info?.name}
              {/* fdsfdsf */}
            </AlertTitle>
          </div>
        </Alert>
        <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
          {name ? (
            <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs underline">
              {"Sabai Shop"}
            </div>
          ) : null}
          <div className="font-bold text-2xl sm:text-4xl lg:text-5xl sm:max-w-xl max-w-xs">
            {info?.banner_title?info.banner_title:"Best shop in the wolrd."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
