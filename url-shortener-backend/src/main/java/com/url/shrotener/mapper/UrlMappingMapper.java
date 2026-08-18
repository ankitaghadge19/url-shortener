package com.url.shrotener.mapper;

import com.url.shrotener.dto.UrlMappingDto;
import com.url.shrotener.model.UrlMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UrlMappingMapper {

    @Mapping(source = "user.username", target = "username")
    UrlMappingDto convertToDto(UrlMapping urlMapping);
}
