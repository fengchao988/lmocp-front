import { types } from 'mobx-state-tree';

const Item = types.model('children',{
  key: types.identifier,
  title: types.string,
  children: types.array(types.late(() => Item)),
});

const ClassDailyOrganizationStore = types
  .model('classDailyOrganizationStore',{
    dataSource: types.array(Item),
  })
  .actions((self) => ({
    fetchData() {
      self.dataSource = [
        {
          key: '1',
          title: '综采区队',
          children: [
            {
              key: '3',
              title: '综采一班',
            },
          ],
        },
        {
          key: '2',
          title: '综采二队',
        },
      ];
    },
  }));

export default ClassDailyOrganizationStore;
