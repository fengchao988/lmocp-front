import { types } from 'mobx-state-tree';
import jp from 'jsonpath';

const Item = types.model('item',{
  name: types.string,
  count: types.integer,
});

const Params = types.model('params', {
  teamId: types.maybeNull(types.string),
  month: types.optional(types.maybeNull(types.integer), new Date().getMonth() + 1),
});

const CurrentMonthFinishCountDescriptionStore = types
  .model('currentMonthFinishCountDescriptionStoreStore',{
    dataSource: types.array(Item),
    params: types.optional(Params, {}),
  })
  .actions((self) => ({
    fetchData() {
      const { teamId, month } = self.params;
      console.log("tem", teamId, month);
      if (!teamId || !month) {
        self.dataSource = [];
        return;
      }
      self.dataSource = [
        {
          name: '综采区队',
          count: 1
        },
        {
          name: '综采二队',
          count: 2
        },
      ];
    },
    setParams(path, value) {
      jp.value(self, path, value);
    }
  }));

export default CurrentMonthFinishCountDescriptionStore;
