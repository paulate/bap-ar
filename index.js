/**
 *  Creates an object to track the loading status of a single asset.
 **/
const createAssetLoadingStatus = (id) => ({ id, loaded: false, progress: 0 });

/**
 * Handles updating the gui when any asset makes loading progress.
 **/
const handleLoadingProgress = (state) => {
  const assetLoadedPerc = Object.values(state.assetLoadingStatusById)
    .map((status) => (status.loaded ? 1.0 : status.progress))
    .reduce((a, b) => a + b, 0);
  const totalNumAssets = state.totalNumAssets;

  const progress = assetLoadedPerc / totalNumAssets;

  // Display progress as text
  const progressElement = document.querySelector("p#loading-percentage");
  progressElement.innerText = `${Math.round(progress * 100)}%`;

  /**
   * When all assets are loaded, hide the loading screen.
   */
  if (progress === 1) {
    const loadingScreen = document.querySelector("#loading-overlay");
    loadingScreen.classList.add("hidden");
  }
};

/**
 *  Called once at app startup to start tracking the loading status of all assets.
 */
const startAssetLoadingGui = (state) => {
  state.assetLoadingStatusById = {};
  /**
   *  Collects all a-frame asset items.
   **/
  const assetElements = document.querySelectorAll("a-asset-item");

  // Calculates the total number of assets being loaded
  state.totalNumAssets = assetElements.length;

  /**
   *  Loops over each a-frame asset item and creates a loading status object
   *  for tracking the loading status of each asset.
   **/
  for (const assetElement of assetElements) {
    const id = assetElement.getAttribute("id");
    state.assetLoadingStatusById[id] = createAssetLoadingStatus(id);

    /**
     *  When the asset is loaded, set the loaded status to true.
     **/
    assetElement.addEventListener("loaded", () => {
      state.assetLoadingStatusById[id].loaded = true;
      handleLoadingProgress(state);
    });

    /**
     * When the asset makes progress, update the progress value.
     **/
    assetElement.addEventListener("progress", (event) => {
      state.assetLoadingStatusById[id].progress =
        event.detail.loadedBytes / event.detail.totalBytes;
      handleLoadingProgress(state);
    });
  }
};

/**
 * When document is loaded, starts up the AR app.
 */
document.addEventListener("DOMContentLoaded", () => {
  const state = {
    // Stores the status of each asset by id.
    assetLoadingStatusById: {},
    // Stores the total number of assets to load.
    totalNumAssets: 1,
  };
  startAssetLoadingGui(state);

  const foundOverlay = document.querySelector("#found-overlay");
  let entities = document.querySelectorAll("a-entity");
  let redirectUrl = "text.html";
  const poemDict = {
    p2: "i",
    p3: "i",
    p4: "i",
    p5: "i",
    p6: "i",
    p7: "i",
    p8: "i",
    p9: "ii",
    p10: "ii",
    p11: "iii",
    p12: "iv",
    p13: "v",
  };

  entities.forEach((entity) => {
    entity.addEventListener("targetFound", (event) => {
      console.log("target found");
      foundOverlay.classList.remove("hidden");
      let model = entity.querySelector("a-gltf-model");
      model.setAttribute("animation-mixer", "timeScale:1");
      let poem = model.getAttribute("src").split("-")[1].split(".")[0];
      redirectUrl = "text.html" + "#" + poemDict[poem];
    });
    entity.addEventListener("targetLost", (event) => {
      console.log("target lost");
      foundOverlay.classList.add("hidden");
      let model = entity.querySelector("a-gltf-model");
      entity.removeChild(model);
      createModel(entity, model.getAttribute("src"));
    });
  });
      // Add click event listener
      foundOverlay.addEventListener('click', () => {
        // Redirect to index.html
        window.location.href = redirectUrl;
      });

  function createModel(parent, src) {
    let newModel = document.createElement("a-gltf-model");
    newModel.setAttribute("rotation", "0 0 0");
    newModel.setAttribute("position", "0 0 0");

    // Get targetIndex from parent entity
    let targetIndex = parseInt(
      parent.getAttribute("mindar-image-target").split(":")[1].trim(),
    );

    // Set scale based on targetIndex
    if (targetIndex >= 7 && targetIndex <= 11) {
      newModel.setAttribute("scale", "2.55 2.55 2.55");
    } else if (targetIndex >= 1 && targetIndex <= 6) {
      newModel.setAttribute("scale", "2 2 2");
    }

    newModel.setAttribute("src", src);
    newModel.setAttribute(
      "animation-mixer",
      "loop:once;timeScale:0; clampWhenFinished: true;",
    );
    parent.appendChild(newModel);
  }
});
