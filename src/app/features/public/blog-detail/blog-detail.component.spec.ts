import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetail } from './blog-detail.component';

describe('Blog', () => {
  let component: BlogDetail;
  let fixture: ComponentFixture<BlogDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
