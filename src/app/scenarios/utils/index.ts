import { ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';

export const toRootParams = (state: RouterState) => {
  const snapshot: RouterStateSnapshot = state.snapshot;
  const root: ActivatedRouteSnapshot = snapshot.root;

  return root.firstChild ? root.firstChild.params : {};
}
