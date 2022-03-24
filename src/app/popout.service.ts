import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, OnDestroy } from '@angular/core';
import { PopoutModalName, POPOUT_MODALS, POPOUT_MODAL_DATA } from './popout.token';
import { SearchResultComponent } from './search-result/search-result.component';

@Injectable()
export class PopoutService implements OnDestroy {
  constructor(
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef
  ) {
  }

  styleSheetElement;

  ngOnDestroy() {}

  isPopoutWindowOpen() {
    return POPOUT_MODALS['windowInstance'] && !POPOUT_MODALS['windowInstance'].closed;
  }

  focusPopoutWindow() {
    POPOUT_MODALS['windowInstance'].focus();
  }

  closePopoutModal() {
    Object.keys(POPOUT_MODALS).forEach(modalName => {
      if (POPOUT_MODALS['windowInstance']) {
        POPOUT_MODALS['windowInstance'].close();
      }
    });
  }
  
  openPopoutModal(data) {
    const windowInstance = this.openOnce(
      'assets/modal/popout.html',
      `${data.modalName}`
    );

    // Wait for window instance to be created
    setTimeout(() => {
      this.createCDKPortal(data, windowInstance);
    }, 1000);
  }

  openOnce(url, target) {
    // open a blank "target" window
    // or get the reference to the existing "target" window
    const winRef = window.open('', target, '', true);
    // if the "target" window was just opened, change its url
    if (winRef.location.href === 'about:blank') {
      winRef.location.href = url;
    }
    return winRef;
  }

  createCDKPortal(data, windowInstance) {
    if (windowInstance) {
      // Create a PortalOutlet with the body of the new window document
      const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);
      // Copy styles from parent window
      document.querySelectorAll('style').forEach(htmlElement => {
        windowInstance.document.head.appendChild(htmlElement.cloneNode(true));
      });
      // Copy stylesheet link from parent window
      this.styleSheetElement = this.getStyleSheetElement();
      windowInstance.document.head.appendChild(this.styleSheetElement);

      this.styleSheetElement.onload = () => {
        // Clear popout modal content
        windowInstance.document.body.innerText = '';

        // Create an injector with modal data
        const injector = this.createInjector(data);

        // Attach the portal
        let componentInstance;
        if (data.modalName === PopoutModalName.searchResult) {
          windowInstance.document.title = 'Search Modal';
          componentInstance = this.attachResultContainer(outlet, injector);
        }

        POPOUT_MODALS[data.modalName] = { windowInstance, outlet, componentInstance };
      };
    }
  }

createInjector(data): PortalInjector {
  const injectionTokens = new WeakMap();
  injectionTokens.set(POPOUT_MODAL_DATA, data);
  return new PortalInjector(this.injector, injectionTokens);
}

attachResultContainer(outlet, injector) {
  const containerPortal = new ComponentPortal(SearchResultComponent, null, injector);
  const containerRef: ComponentRef<SearchResultComponent> = outlet.attach(containerPortal);
  return containerRef.instance;
}

getStyleSheetElement() {
    const styleSheetElement = document.createElement('link');
    document.querySelectorAll('link').forEach(htmlElement => {
      if (htmlElement.rel === 'stylesheet') {
        const absoluteUrl = new URL(htmlElement.href).href;
        styleSheetElement.rel = 'stylesheet';
        styleSheetElement.href = absoluteUrl;
      }
    });
    console.log(styleSheetElement.sheet);
    return styleSheetElement;
  }
}