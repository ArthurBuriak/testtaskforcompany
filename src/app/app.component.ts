import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Product } from './shared/interface/product';
import { BasicService } from './shared/services/basic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  closeResult = '';
  model: any;
  isVaid: boolean = false;
  isUploadValid: boolean = false;
  sort: string = '';
  getAllProducts: Product[] = [];
  getProductById: any = {};
  url: any = '';
  constructor(
    private modalService: NgbModal,
    private basicService: BasicService,
    private cd: ChangeDetectorRef
  ) {}

  formProduct: FormGroup = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]{2,20}'),
    ]),
    count: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{1,3}'),
    ]),
    size: new FormGroup({
      width: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,3}'),
      ]),
      height: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,3}'),
      ]),
    }),
    weight: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{1,3}g'),
    ]),
    comments: new FormArray([
      new FormGroup({
        description: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-zA-Z]{2,100}'),
        ]),
        date: new FormControl('', Validators.required),
      }),
    ]),
  });

  formUpdateProduct: FormGroup = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z]{2,20}'),
    ]),
    count: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{1,3}'),
    ]),
    size: new FormGroup({
      width: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,3}'),
      ]),
      height: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,3}'),
      ]),
    }),
    weight: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{1,3}g'),
    ]),
    comments: new FormGroup({
      description: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,100}'),
      ]),
      date: new FormControl('', Validators.required),
    }),
  });

  ngOnInit() {
    this.getProducts();
  }

  getProducts(): void {
    this.basicService.getProducts().subscribe((data) => {
      console.log(data);
      this.getAllProducts = data;
    });
  }

  addProduct(): void {
    if (this.formProduct.valid) {
      this.isVaid = false;
      this.basicService
        .postProducts(this.formProduct.value)
        .subscribe((data) => {
          console.log('Post data', data);
          this.basicService.getProducts().subscribe((data) => {
            this.getAllProducts = data;
          });
        });
    } else {
      this.isVaid = true;
    }
  }

  deleteProduct(id: number | undefined): void {
    this.basicService.delteProduct(id).subscribe((data) => {
      console.log('Delete data', data);
      this.basicService.getProducts().subscribe((data) => {
        this.getAllProducts = data;
      });
    });
  }

  get productImage(): any {
    return this.formProduct.get('imageUrl') as any;
  }

  get productComments(): any {
    return this.formProduct.get("comments") as any;
  }

  imageUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.formProduct.patchValue({
          imageUrl: (<FileReader>event.target).result,
        });
        console.log(this.formProduct.value);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  imageUpdateUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.formUpdateProduct.patchValue({
          imageUrl: (<FileReader>event.target).result,
        });
        console.log(this.formProduct.value);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  updateProduct(id: number | undefined): void {
    console.log(id);
    if (this.formUpdateProduct.valid) {
      this.basicService
        .updateProduct(id, this.formUpdateProduct.value)
        .subscribe((data) => {
          console.log('Something good', data);
          this.basicService.getProducts().subscribe((data) => {
            this.getAllProducts = data;
          });
        });
      this.isUploadValid = false;
    } else {
      this.isUploadValid = true;
    }
  }

  sortBy(event: any): void {
    console.log(event.target.value);
    this.sort = event.target.value;
    console.log('Event target sort', this.sort);
  }

  showMore(id: number | undefined): void {
    console.log(id);
    this.basicService.getProductById(id).subscribe((data) => {
      this.getProductById = data;
      console.log(data);
    });
  }

  createGroup(): FormGroup {
    return new FormGroup({
      description: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]{2,100}'),
      ]),
      date: new FormControl('', Validators.required),
    });
  }

  addComment(): void {
    const comments = this.formProduct.get('comments') as any;
    comments.push(this.createGroup());
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
