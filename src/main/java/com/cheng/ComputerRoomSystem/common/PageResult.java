package com.cheng.ComputerRoomSystem.common;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

@Getter
public class PageResult<T> {

    private final List<T> list;
    private final long total;
    private final int page;
    private final int size;
    private final int totalPages;

    private PageResult(List<T> list, long total, int page, int size, int totalPages) {
        this.list = list;
        this.total = total;
        this.page = page;
        this.size = size;
        this.totalPages = totalPages;
    }

    public static <E, T> PageResult<T> of(Page<E> page, Function<E, T> mapper) {
        return new PageResult<>(
                page.getContent().stream().map(mapper).toList(),
                page.getTotalElements(),
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalPages()
        );
    }
}