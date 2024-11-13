import { useEffect, useState } from "react";
import "./App.css";
import MyTable from "./components/MyTable";
import axios from "axios";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { TMovie, TVotes } from "./types";
import MyNavbar from "./components/MyNavbar";

const BASE_URL = "http://62.90.222.249:10001"

function App() {
  const [connected, setConnected] = useState<boolean>(false)
  const [lastReceiveTime, setLastReceiveTime] = useState<string>("")
  const [token, setToken] = useLocalStorage("jwt", "");
  const [movies, setMovies] = useState<TMovie[]>([]);
  const [votes, setVotes] = useState<TVotes[]>([]);
  
  useEffect(() => {
    const login = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/admin/login`, {username: "test",password: "test123"}, {headers: { "Content-Type": "application/json" }});
        setToken(response.data.token);
      } catch (error) {
        setToken("jwt")
        console.error(error);
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/GetMovies`, {headers: { Authorization: `Bearer ${token}` }});        
        setMovies(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const connectToHub = async () => {
      try {
        const hubConnection = new HubConnectionBuilder().withUrl("/ClientHub", { accessTokenFactory: () => token }).configureLogging(LogLevel.Information).build();
        hubConnection.on("DataReceived", (data) => {          
          setVotes(data)
          const now = new Date()
          const formattedDate = now.toLocaleDateString("en-GB")
          const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false})
          setLastReceiveTime(`${formattedDate} ${formattedTime}`)
        });
        await hubConnection.start();
        setConnected(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (!token) {
      login();
    } else {
      fetchMovies();
      connectToHub();
    }
  }, [token]);
  

  return (
    <>
    <header>
      <MyNavbar  connected={connected} lastReceiveTime={lastReceiveTime}/>
    </header>
    <main>
        <MyTable movies={movies} votes={votes}/>
    </main>
    </>
  );
}

export default App;
