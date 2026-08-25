export function testSharedElements(translateService, fixture, jsonLanguage) {
  const h1 = fixture.nativeElement.querySelector('h1').innerText.trim();
  const searchLabel = fixture.nativeElement
    .querySelector('#search-label')
    .innerText.trim();
  const a = fixture.nativeElement.querySelector('a').innerText.trim();

  translateService
    .get(h1)
    .toPromise()
    .then((res: string) => {
      try {
        expect(res).toEqual(
          jsonLanguage.superAdministrator.manage.evaluators.list.title,
        );
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });

  translateService
    .get(searchLabel)
    .toPromise()
    .then((res: string) => {
      try {
        expect(res).toEqual(jsonLanguage.superAdministrator.manage.searchInput);
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });

  translateService
    .get(a)
    .toPromise()
    .then((res: string) => {
      try {
        expect(res).toEqual(
          jsonLanguage.superAdministrator.manage.evaluators.list.new,
        );
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });
}

export function testMatTab(translateService, fixture, jsonLanguage) {
  const matTab1 = fixture.nativeElement
    .querySelectorAll('.mat-tab-label-content')[0]
    .textContent.trim();
  const matTab2 = fixture.nativeElement
    .querySelectorAll('.mat-tab-label-content')[1]
    .textContent.trim();
  const matTab3 = fixture.nativeElement
    .querySelectorAll('.mat-tab-label-content')[2]
    .textContent.trim();
  translateService
    .get(matTab1)
    .toPromise()
    .then((res: string) => {
      try {
        expect(res).toEqual(
          jsonLanguage.superAdministrator.manage.stateMenu.all,
        );
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });

  translateService
    .get(matTab2)
    .toPromise()
    .then((res: string) => {
      try {
        expect(res).toEqual(
          jsonLanguage.superAdministrator.manage.stateMenu.active,
        );
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });

  translateService
    .get(matTab3)
    .toPromise()
    .then((res: string) => {
      try {
        expect(res).toEqual(
          jsonLanguage.superAdministrator.manage.stateMenu.inactive,
        );
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });
}

export function validateExistKey(keyToValidate, correctKey, translateService) {
  translateService
    .get(keyToValidate)
    .toPromise()
    .then((res: string) => {
      try {
        expect(res).toEqual(correctKey);
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });
}
