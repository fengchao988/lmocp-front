import { types } from 'mobx-state-tree';
import jp from 'jsonpath';

const Item = types.model('item',{
  name: types.string,
  value: types.string,
});

const Params = types.model('params', {
  teamId: types.maybeNull(types.string),
  day: types.optional(types.maybeNull(types.integer), new Date().getDay()),
});

const CurrentDayFinishDescriptionStore = types
  .model('currentDayFinishDescriptionStoreStore',{
    dataSource: types.array(Item),
    params: types.optional(Params, {}),
  })
  .actions((self) => ({
    fetchData() {
      const { teamId, day } = self.params;
      console.log("tem", teamId, day);
      if (!teamId || !day) {
        self.dataSource = [];
        return;
      }
      self.dataSource = [
        {
          name: '综采区队',
          value: '完成'
        },
        {
          name: '综采二队',
          value: '未完成'
        },
      ];
    },
    handleActions() {

    },
    setParams(path, value) {
      jp.value(self, path, value);
    }
  }));

export default CurrentDayFinishDescriptionStore;
