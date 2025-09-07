import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';

import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';
@Injectable()
export class PaginationProvider {

  constructor(
    /*
     * Injecting Request
     */
    @Inject(REQUEST)
    private readonly request: Request,
  ) { }
  // here we are using the ObjectLiteral interface from typeorm
  // to make the function generic and able to work with any type of entity
  // by using the ObjectLiteral interface we are saying that the type T is an object with any string keys
  // therefore anything other than a repository of type T will not be accepted
  // by using the ObjectLiteral interface

  //!--  BASIC PAGINATION  --> WE ARE ENSUREING ONLY REPOSITORIES ARE ACCEPTED LIKE THEIR ENTITIES SUCH AS POSTS, USERS, ETC.
  public async paginateQuery<T extends ObjectLiteral>(paginationQuery: PaginationQueryDto, repository: Repository<T>): Promise<Paginated<T>> {
    let results = await repository.find({
      take: paginationQuery.limit,
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
    });

    const baseUrl = this.request.protocol + '://' + this.request.headers.host;

    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();
    // the ceil is used to round up the total pages to the nearest integer
    // like from 0.5 to 1

    // the reason we're caculating the total pages is to know how many pages are there
    // which it changes based on the limit
    // so if the limit is 10 and the total items are 20
    // then the total pages will be 2
    // and if the limit is 20 and the total items are 20
    // then the total pages will be 1
    // and if the limit is 30 and the total items are 20
    // then the total pages will be 1
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);

    const nextPage = paginationQuery.page === totalPages ? paginationQuery.page : paginationQuery.page + 1;
    const previousPage = paginationQuery.page === 1 ? paginationQuery.page : paginationQuery.page - 1;
    const finalResponse: Paginated<T> = {
      data: results,
      totalItems: totalItems,
      currentPage: paginationQuery.page,
      totalPages: totalPages,
      itemsPerPage: paginationQuery.limit,
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?&limit=${paginationQuery.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?&limit=${paginationQuery.limit}&page=${totalPages}  `,
        current: `${newUrl.origin}${newUrl.pathname}?&limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?&limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?&limit=${paginationQuery.limit}&page=${previousPage}`,
      }
    };

    return finalResponse;
  }
}