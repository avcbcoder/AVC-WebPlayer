import { getAzLyrics } from "./az.js";
import { getFandomLyrics } from "./fandom.js";
import { STORE_VAR } from "../../constants.js";

const fetchLyrics = (storage, songDetails, render) => {
  const { title, artist } = songDetails;

  const onSuccessLyrics = lyrics => {
    storage.get(["store"], result => {
      const store = result.store;
      if (store[STORE_VAR.LYRICS].state !== "success")
        store[STORE_VAR.LYRICS] = { state: "success", data: lyrics };
      storage.set({ store: store }, function() {
        render();
      });
    });
  };

  const onFailureLyrics = () => {
    storage.get(["store"], result => {
      const store = result.store;
      if (store[STORE_VAR.LYRICS].state === "fetching")
        store[STORE_VAR.LYRICS] = { state: "fail", data: "" };
      storage.set({ store: store }, function() {
        render();
      });
    });
  };

  for (let i = 0; i < artist.length; i++) {
    getFandomLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
    getAzLyrics(title, artist[i], onSuccessLyrics, onFailureLyrics);
  }
};

export { fetchLyrics };
