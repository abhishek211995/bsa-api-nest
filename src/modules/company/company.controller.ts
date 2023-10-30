import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./company.dto";
import { makeHTTPResponse } from "../../utils/httpResponse.util";

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(@Body() body: CreateCompanyDto) {
    try {
      const company = await this.companyService.createCompany(body);
      return makeHTTPResponse(
        company,
        HttpStatus.CREATED,
        "Company Created Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAllCompany() {
    try {
      const list = await this.companyService.getAllCompanies();
      return makeHTTPResponse(list);
    } catch (error) {
      throw error;
    }
  }
}
