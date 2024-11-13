import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  Input,
  CardBody,
  CardFooter,
  Typography,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { TMovie, TRows, TVotes } from "../types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DialogDefault from "./Dialog";

interface IMyTable {
  movies: TMovie[];
  votes: TVotes[];
}

const MyTable = ({ movies, votes }: IMyTable) => {
  const [rows, setRows] = useState<TRows[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [foundFiltered, setFoundFiltered] = useState<TMovie[]>();
  const [sortTable, setSortTable] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortTableRows, setSortTableRows] = useState<TRows[]>(rows);
  const prevTotalVotesRef = useRef<{ [id: number]: number | null }>({});
  const [selectRow, setSelectRow] = useState<TRows>();


  const TABLE_HEAD = [
    "Movie ID",
    "Movie Description",
    "Total Votes",
    "Last Updated Time",
    "",
  ];
  const TABLE_ROWS: TRows[] = sortTable ? sortTableRows : rows;

  const voteHistory = useRef<{
    [key: number]: { id: number; totalVotes: number; generatedTime: string }[];
  }>({});

  useMemo(() => {
    const voteData = movies.map((movie: TMovie) => {
      const movieVotes = votes.filter(
        (vote: TVotes) => vote.itemId === movie.id
      );
      const totalVotes = movieVotes.reduce(
        (acc, curr) => acc + curr.itemCount,
        0
      );

      const latestVote = movieVotes.reduce((latest, vote) => {
        const voteTime = new Date(vote.generatedTime).getTime();
        return voteTime > latest ? voteTime : latest;
      }, 0);

      const formattedTime = latestVote
        ? `${new Date(latestVote).toLocaleDateString("en-GB")} ${new Date(
            latestVote
          ).toLocaleTimeString("en-GB", { hour12: false })}`
        : "N/A";

      if (!voteHistory.current[movie.id]) {
        voteHistory.current[movie.id] = [];
      }
      voteHistory.current[movie.id].push({
        id: movie.id,
        totalVotes,
        generatedTime: formattedTime,
      });
      if (voteHistory.current[movie.id].length >= 20) {
        voteHistory.current[movie.id].shift();
      }
      const votesArray = Object.values(voteHistory.current[movie.id]);
      const totalVotesWIthHistory = votesArray.reduce(
        (acc, curr) => acc + curr.totalVotes,
        0
      );

      const lastUpdateTime = Object.values(
        voteHistory.current[movie.id]
      ).filter((f) => f.generatedTime !== "N/A");

      return {
        id: movie.id,
        description: movie.description,
        itemId: movie.id,
        movieVotes,
        totalVotesWIthHistory,
        lastUpdateTime,
        generatedTime: formattedTime,
        latestVoteTimeFormatted: latestVote
      };
    });

    setRows(voteData);
  }, [movies, votes]);

  const handleOpenChart = () => {
    setOpenDialog(!openDialog);
  }

  const handleRowMovie = (id: number) => {
    const rowMovie = TABLE_ROWS.find((movie) => movie.id === id)
    setSelectRow(rowMovie)
    setOpenDialog(!openDialog);
  }

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilterSearch(e.target.value);

  useMemo(() => {
    setFoundFiltered(
      movies.filter((movie: TMovie) =>
        movie.description
          .trim()
          .toLocaleLowerCase()
          .includes(filterSearch.trim().toLocaleLowerCase())
      )
    );
  }, [filterSearch]);

  const handleSort = (head: string) => {
    if (sortTable === head) {
    setSortTable(head)
    setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
    }else {
      setSortTable(head);
      setSortOrder("asc");
    }
  }

  useMemo(() => {
    if (sortTable) {
      const index = TABLE_HEAD.indexOf(sortTable);
      let sortedRows = [...TABLE_ROWS]; 
      switch (index) {
        case 0: // "Movie ID"
          sortedRows.sort((a, b) => {
            return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
          });
          break;
        case 1: // "Movie Description"
          sortedRows.sort((a, b) => {
            return sortOrder === "asc"
              ? a.description.localeCompare(b.description)
              : b.description.localeCompare(a.description);
          });
          break;
        case 2: // "Total Votes"
          sortedRows.sort((a, b) => {
            return sortOrder === "asc"
              ? a.totalVotesWIthHistory - b.totalVotesWIthHistory
              : b.totalVotesWIthHistory - a.totalVotesWIthHistory;
          });
          break;
        case 3: // "Last Updated Time"
          sortedRows.sort((a, b) => {
            const dateA = new Date(a.latestVoteTimeFormatted).getTime() ?? ""
            const dateB = new Date(b.latestVoteTimeFormatted).getTime() ?? ""
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
          });
          break;
        default:
          break;
      }
      setSortTableRows(sortedRows);
    } else {
      setSortTableRows(rows);
    }
  }, [sortTable, sortOrder, rows]);
  

  useEffect(() => {
    TABLE_ROWS.forEach(row => {
      prevTotalVotesRef.current[row.id] = row.totalVotesWIthHistory;
    });
  }, [TABLE_ROWS]);

  if (!movies || !votes) {
    <div className="flex flex-row min-h-screen justify-center items-center">
      <Spinner />
      <p>Loading...</p>
    </div>;
  }

  return (
    <>
    <Card className="h-full w-full mt-4">
      <CardBody className="px-0">
        <div className="w-full md:w-72 mt-4 p-1">
          <Input
            label="Filter"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            onChange={handleFilter}
          />
        </div>
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-2 font-sans text-sm antialiased font-normal leading-none opacity-70"
                  >
                    {head}
                    <Button onClick={() => handleSort(head)}  variant="text" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                      </svg>
                    </Button>
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {foundFiltered && foundFiltered.length !== movies.length && foundFiltered?.map((f) => {
              const isLast = foundFiltered.length - 1;
              const classes = `p-4 border-b border-blue-gray-50 hover:bg-fuchsia-600 ${isLast ? "bg-yellow-200" : "bg-yellow-200"}`;
              return (
                <tr key={f.id}>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {f.id}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {f.description}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}></td>
                  <td className={classes}></td>
                  <td className={classes}></td>
                </tr>
              );
           })}
            {TABLE_ROWS.map(
              (
                { id, description, totalVotesWIthHistory, lastUpdateTime },
                index: number
              ) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes ="p-4 border-b border-blue-gray-50";
                const prevTotalVotes = prevTotalVotesRef.current[id] || 0;
                return (
                  <>
                  <tr key={id} 
                  onClick={() => handleRowMovie(id)} 
                  className="hover:bg-blue-gray-50 hover:cursor-pointer">
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {id}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {description}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {totalVotesWIthHistory}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {lastUpdateTime[lastUpdateTime.length - 1]
                            ?.generatedTime ?? ""}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      {totalVotesWIthHistory > prevTotalVotes ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                      ) : totalVotesWIthHistory < prevTotalVotes ? (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowRightIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </td>
                  </tr>
                    </>
                );
              }
            )}
          </tbody>
          <DialogDefault open={openDialog} handleOpen={handleOpenChart} movie={selectRow} />
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4"></CardFooter>
    </Card>
     </>
  );
};

export default MyTable;
