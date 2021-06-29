import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RatingService } from '@app/core/services/rating.service';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.page.html',
  styleUrls: ['./ratings.page.scss'],
})
export class RatingsPage implements OnInit {
  pathParamSub: any;
  id: any;
  allRatings = [];
  ratingsLoaded = false;
  constructor(private route: ActivatedRoute, private ratingService: RatingService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params.id);
      this.id = params.id;
    });
    this.ratingService.getAllTransactionRatings(this.id).subscribe(results => {
      this.ratingsLoaded = true;
      console.log(results);
      this.allRatings = results;

    });
  }

}
