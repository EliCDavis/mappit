import { TopologyService } from '../topology/topology.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {

  commentForm: FormControl;

  @Input() topoName: string;
  @Input() postId: string;
  
  constructor(private topoService: TopologyService) {
    this.commentForm = new FormControl('', [Validators.required]);
  }

  comment() {
    this.topoService.comment(this.topoName, this.postId, this.commentForm.value)
  }

  ngOnInit() {
  }

}
