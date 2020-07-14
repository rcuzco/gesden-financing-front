import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PermissionService } from '../../services';
import { SharedModule } from '../../shared.module';

class PermissionServiceMock {
  hasPermission(permission: string) {
    return permission === 'permision.ok';
  }
}

describe('HasPermissionDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SharedModule],
      providers: [{ provide: PermissionService, useClass: PermissionServiceMock }]
    });
  });

  it('component should be included in DOM', () => {
    const permission = 'permision.ok';
    const template = `<div *hasPermission="'${permission}'">Test with role: ${permission}</div>`;
    const fixture = createTestComponent(template);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(1);
  });

  it('component should not be included in DOM', () => {
    const permission = 'permision.bad';
    const template = `<div *hasPermission="'${permission}'">Test with role: ${permission}</div>`;
    const fixture = createTestComponent(template);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
  });

});

@Component({ selector: 'pd-test-cmp', template: '' })
class TestComponent {
}

function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, { set: { template: template } })
    .createComponent(TestComponent);
}
