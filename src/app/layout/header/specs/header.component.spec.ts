import {async, TestBed} from '@angular/core/testing';
import {AppTestModule} from '../../../app-test.module';
import {FooterComponent} from '../..';

describe('Header Component', () => {
  let component: FooterComponent;
  beforeEach(async (() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      declarations: [FooterComponent]
    }).compileComponents();
    component = TestBed.createComponent(FooterComponent);
  }));
  it('should create the FooterComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should write test for the component', () => {
    // TODO : Write the test
  });
});
