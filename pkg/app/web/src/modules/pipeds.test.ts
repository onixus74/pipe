import { dummyPiped } from "../__fixtures__/dummy-piped";
import {
  pipedsSlice,
  clearRegisteredPipedInfo,
  addPiped,
  fetchPipeds,
  recreatePipedKey,
  selectPipedsByEnv,
  Piped,
  editPiped,
} from "./pipeds";

const baseState = {
  entities: {},
  ids: [],
  registeredPiped: null,
  updating: false,
};

test("selectPipedsByEnv", () => {
  const disabledPiped: Piped.AsObject = {
    ...dummyPiped,
    id: "piped-2",
    disabled: true,
  };
  expect(selectPipedsByEnv({ entities: {}, ids: [] }, "env-1")).toEqual([]);
  expect(
    selectPipedsByEnv(
      {
        entities: {
          [dummyPiped.id]: dummyPiped,
          [disabledPiped.id]: disabledPiped,
        },
        ids: [dummyPiped.id, disabledPiped.id],
      },
      dummyPiped.envIdsList[0]
    )
  ).toEqual([dummyPiped]);
});

describe("pipedsSlice reducer", () => {
  it("should return the initial state", () => {
    expect(
      pipedsSlice.reducer(undefined, {
        type: "TEST_ACTION",
      })
    ).toEqual(baseState);
  });

  it(`should handle ${clearRegisteredPipedInfo.type}`, () => {
    expect(
      pipedsSlice.reducer(
        {
          ...baseState,
          registeredPiped: {
            id: "piped-1",
            key: "piped-key",
          },
        },
        {
          type: clearRegisteredPipedInfo.type,
        }
      )
    ).toEqual(baseState);
  });

  describe("addPiped", () => {
    it(`should handle ${addPiped.fulfilled.type}`, () => {
      expect(
        pipedsSlice.reducer(baseState, {
          type: addPiped.fulfilled.type,
          payload: {
            id: "piped-1",
            key: "piped-key",
          },
        })
      ).toEqual({
        ...baseState,
        registeredPiped: {
          id: "piped-1",
          key: "piped-key",
        },
      });
    });
  });

  describe("fetchPipeds", () => {
    it(`should handle ${fetchPipeds.fulfilled.type}`, () => {
      expect(
        pipedsSlice.reducer(baseState, {
          type: fetchPipeds.fulfilled.type,
          payload: [dummyPiped],
        })
      ).toEqual({
        ...baseState,
        entities: { [dummyPiped.id]: dummyPiped },
        ids: [dummyPiped.id],
      });
    });
  });

  describe("recreatePipedKey", () => {
    it(`should handle ${recreatePipedKey.fulfilled.type}`, () => {
      expect(
        pipedsSlice.reducer(baseState, {
          type: recreatePipedKey.fulfilled.type,
          payload: "recreated-piped-key",
          meta: {
            arg: {
              pipedId: "piped-1",
            },
          },
        })
      ).toEqual({
        ...baseState,
        registeredPiped: {
          id: "piped-1",
          key: "recreated-piped-key",
        },
      });
    });
  });

  describe("editPiped", () => {
    it(`should handle ${editPiped.pending.type}`, () => {
      expect(
        pipedsSlice.reducer(baseState, {
          type: editPiped.pending.type,
        })
      ).toEqual({
        ...baseState,
        updating: true,
      });
    });

    it(`should handle ${editPiped.rejected.type}`, () => {
      expect(
        pipedsSlice.reducer(
          { ...baseState, updating: true },
          {
            type: editPiped.rejected.type,
          }
        )
      ).toEqual({
        ...baseState,
        updating: false,
      });
    });

    it(`should handle ${editPiped.fulfilled.type}`, () => {
      expect(
        pipedsSlice.reducer(
          { ...baseState, updating: true },
          {
            type: editPiped.fulfilled.type,
          }
        )
      ).toEqual({
        ...baseState,
        updating: false,
      });
    });
  });
});
