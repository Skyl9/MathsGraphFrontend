import { useUIStore } from "../useUIStore";

describe("useUIStore", () => {
  // Avant chaque test, on réinitialise l'état du store
  beforeEach(() => {
    // Zustand n'a pas de reset natif propre à l'état persisté facilement accessible dans les tests simples,
    // on peut juste réaffecter les valeurs ou vider le localStorage
    window.localStorage.clear();
    useUIStore.setState({
      darkMode: false,
      colorAxiome: "#52C575",
      debugMode: false,
      currentView: "grille",
      graphTheme: "classique",
      renderMode: "quality",
      useInstancedEdges: false,
      hasSeenShortcuts: false,
      zoomAction: { action: null, timestamp: 0 },
    });
  });

  it("should initialize with correct default values", () => {
    const state = useUIStore.getState();
    expect(state.darkMode).toBe(false);
    expect(state.colorAxiome).toBe("#52C575");
    expect(state.debugMode).toBe(false);
    expect(state.renderMode).toBe("quality");
  });

  it("should toggle darkMode", () => {
    const state = useUIStore.getState();
    expect(state.darkMode).toBe(false);

    useUIStore.getState().toggleDarkMode();
    expect(useUIStore.getState().darkMode).toBe(true);

    useUIStore.getState().setDarkMode(false);
    expect(useUIStore.getState().darkMode).toBe(false);
  });

  it("should update debugMode correctly", () => {
    useUIStore.getState().setDebugMode(true);
    expect(useUIStore.getState().debugMode).toBe(true);

    useUIStore.getState().setDebugMode((prev) => !prev);
    expect(useUIStore.getState().debugMode).toBe(false);
  });

  it("should trigger zoom actions with a new timestamp", () => {
    vi.useFakeTimers();
    useUIStore.getState().triggerZoomAction("in");
    const zoomIn = useUIStore.getState().zoomAction;
    expect(zoomIn.action).toBe("in");
    expect(zoomIn.timestamp).toBeGreaterThan(0);

    const oldTimestamp = zoomIn.timestamp;

    vi.advanceTimersByTime(10);

    useUIStore.getState().triggerZoomAction("out");
    const zoomOut = useUIStore.getState().zoomAction;
    expect(zoomOut.action).toBe("out");
    expect(zoomOut.timestamp).toBeGreaterThanOrEqual(oldTimestamp);
    vi.useRealTimers();
  });

  it("should persist specific fields to localStorage", () => {
    useUIStore.getState().setDarkMode(true);
    useUIStore.getState().setColorAxiome("#112233");

    // Le nom de la clé de persistance est "mathgraph-ui-storage"
    const stored = window.localStorage.getItem("mathgraph-ui-storage");
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.darkMode).toBe(true);
    expect(parsed.state.colorAxiome).toBe("#112233");
  });
});
