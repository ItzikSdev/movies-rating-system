import { Navbar, Typography, Chip } from "@material-tailwind/react";

interface INavbar {
  connected: boolean;
  lastReceiveTime: string;
}

const MyNavbar = ({ connected, lastReceiveTime }: INavbar) => {


  return (
    <div className="sticky top-0 z-10">
      <Navbar className="sticky top-0 z-1 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            variant="h4"
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            Movies Rating System
          </Typography>
          <div className="flex items-center gap-4">
          Last receive data time <span>{lastReceiveTime}</span>
            <div className="flex items-center gap-x-1">
              <div className="flex gap-2">
                {connected ? (
                  <Chip
                    variant="ghost"
                    color="green"
                    size="sm"
                    value="Online"
                    icon={
                      <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />
                    }
                  />
                ) : (
                  <Chip
                    variant="ghost"
                    color="red"
                    size="sm"
                    value="Offline"
                    icon={
                      <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-red-900 content-['']" />
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default MyNavbar;
