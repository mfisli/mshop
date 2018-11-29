import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { CategoryService } from './../../services/category.service';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  categories$: Observable<any>;
  product = {};
  id: string;

  constructor(
    categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categories$ = categoryService.getCategories();
    this.getProduct();
  }

  ngOnInit() {
  }

  getProduct() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.productService.get(this.id)
        .take(1)
        .subscribe(product => this.product = product);
    }
  }

  save(product) {
    if (this.id) {
      this.productService.update(this.id, product);
      console.log('updated', this.id, product);
    } else {
      this.productService.create(product);
      console.log('created', this.id, product);
    }

    // don't need to wait for response since firebase is a 'live' database
    this.router.navigate(['/admin/products']);
  }

  delete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(this.id);
      this.router.navigate(['/admin/products']);
    }
  }

}
