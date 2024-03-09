import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { NewDraftDto } from "src/modules/draftForm/draftForm.dto";
import { DraftFormService } from "src/modules/draftForm/draftForm.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("draft")
export class DraftFormController {
  constructor(private readonly draftService: DraftFormService) {}

  @Post()
  async createDraft(@Body() data: NewDraftDto) {
    try {
      const result = await this.draftService.createDraft(data);
      return makeHTTPResponse(
        result,
        HttpStatus.CREATED,
        "Draft Created Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getDraftsForUser(@Query("userId") userId: string) {
    try {
      const result = await this.draftService.getDrafts(Number(userId));
      return makeHTTPResponse(
        result,
        HttpStatus.OK,
        "Draft Fetched Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async updateDraft(@Body() data: NewDraftDto, @Query("id") id: string) {
    try {
      const result = await this.draftService.updateDraft(Number(id), data);
      return makeHTTPResponse(
        result,
        HttpStatus.OK,
        "Draft updated Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async deleteDraft(@Body() data: NewDraftDto) {
    try {
      const result = await this.draftService.createDraft(data);
      return makeHTTPResponse(
        result,
        HttpStatus.OK,
        "Draft deleted Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }
}
