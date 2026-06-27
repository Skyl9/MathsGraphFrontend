import { renderHook, act } from "@testing-library/react";
import { useEntityEdit } from "../useEntityEdit";
import { useEntityData } from "../useEntityData";
import { vi } from "vitest";

// Mock des hooks et dépendances externes
vi.mock("../useEntityData", () => ({
  useEntityData: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock des constantes
vi.mock("../../constants/editableFields", () => ({
  createCategoryEditableFields: vi.fn(() => ({ nom: { type: "text" } })),
  createTypeEditableFields: vi.fn(),
  createMathematicienEditableFields: vi.fn(),
  createEditableFields: vi.fn(),
}));

describe("useEntityEdit", () => {
  const mockUpdateField = vi.fn();
  const mockData = { id: 1, nom: "Concept Test" };
  const mockEditableFieldsOptions = {};
  const mockRefetchData = vi.fn();
  const mockCreateField = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Configuration par défaut du mock useEntityData
    (useEntityData as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      editableFieldsOptions: mockEditableFieldsOptions,
      refetchData: mockRefetchData,
      updateField: mockUpdateField,
      createField: mockCreateField,
    });
  });

  it("initializes with correct default values", () => {
    const { result } = renderHook(() => useEntityEdit("category", "1"));

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentEditField).toBeNull();
    expect(result.current.newContent).toBeUndefined();
    expect(result.current.data).toEqual({ id: 1, nom: "Concept Test" });
  });

  it("handleEdit opens the modal and sets the current value", () => {
    const { result } = renderHook(() =>
      useEntityEdit<{ nom: string }>("category", "1"),
    );

    act(() => {
      result.current.handleEdit("nom");
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.currentEditField).toBe("nom");
    expect(result.current.newContent).toBe("Concept Test");
  });

  it("cancelChanges resets the edit state", () => {
    const { result } = renderHook(() =>
      useEntityEdit<{ nom: string }>("category", "1"),
    );

    act(() => {
      result.current.handleEdit("nom");
    });

    act(() => {
      result.current.cancelChanges();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentEditField).toBeNull();
    expect(result.current.newContent).toBeUndefined();
  });

  it("saveChanges calls updateField and closes the modal optimistically", async () => {
    mockUpdateField.mockResolvedValueOnce(true);

    const { result } = renderHook(() =>
      useEntityEdit<{ nom: string }>("category", "1"),
    );

    // 1. Ouvre l'édition
    act(() => {
      result.current.handleEdit("nom");
    });

    // 2. Modifie le texte
    act(() => {
      result.current.setNewContent("Nouveau Concept");
    });

    // 3. Sauvegarde
    await act(async () => {
      await result.current.saveChanges();
    });

    // Vérifications :
    // updateField appelé avec la bonne clé et valeur
    expect(mockUpdateField).toHaveBeenCalledWith("nom", "Nouveau Concept");

    // Fermeture optimiste de la modale
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentEditField).toBeNull();
  });

  it("handleEdit handles undefined data correctly and sets empty string", () => {
    (useEntityData as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      editableFieldsOptions: mockEditableFieldsOptions,
      refetchData: mockRefetchData,
      updateField: mockUpdateField,
      createField: mockCreateField,
    });

    const { result } = renderHook(() =>
      useEntityEdit<{ nom: string }>("category", "1"),
    );

    act(() => {
      result.current.handleEdit("nom");
    });

    expect(result.current.newContent).toBe("");
  });

  it("saveChanges returns early if currentEditField is null", async () => {
    const { result } = renderHook(() =>
      useEntityEdit<{ nom: string }>("category", "1"),
    );

    await act(async () => {
      await result.current.saveChanges();
    });

    expect(mockUpdateField).not.toHaveBeenCalled();
  });

  it("saveChanges catches and logs error if updateField throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockUpdateField.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() =>
      useEntityEdit<{ nom: string }>("category", "1"),
    );

    act(() => {
      result.current.handleEdit("nom");
    });

    act(() => {
      result.current.setNewContent("Nouveau Concept");
    });

    await act(async () => {
      await result.current.saveChanges();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Erreur critique lors de la sauvegarde:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
