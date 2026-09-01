program test
  implicit none
  integer :: c, a, b
  integer :: max_a = 0, max_b = 0
  real(kind=8) :: k, max_k = 0., max_k_old
  write(*, fmt='("write your current max_k: ")', advance='no')
  read(*, fmt='(f12.5)') max_k
  write(*, fmt='(3a5, a9)') "a", "b", "c", "k"
  do c = 1, 10000000
    max_k_old = max_k
    do a = 1, 10
      do b = 1, 10
        k = get_sum_term(a, b, c)
        if (k > max_k) then
          max_a = a
          max_b = b
          max_k = k
        end if
      end do
    end do
    if (max_k_old < max_k) then
      print '(3i5,f12.5)', max_a, max_b, c, max_k
      exit
    end if
  end do
contains
  function get_sum_term(max_i, max_j, c) result(sum)
    implicit none
    integer, intent(in) :: max_i, max_j, c
    integer :: i, j
    real(kind=8) :: sum, div = 0.
    sum = 0.
    do i = 1, max_i
      do j = 1, max_j
        div = dble(1 + i)**j
        sum = sum + sin(c * dble(1 + i)**j) / div
      end do
    end do
    sum = sum * c / 100
  end function get_sum_term
end program test

