#include <stdio.h>

typedef struct
{
	int number;
}number_t;


void print_num(number_t *num)
{
	printf("number is %d\n", num->number);
}

int main()
{
	number_t a;
	a.number = 5;
	
	printf("hello world\n");
}