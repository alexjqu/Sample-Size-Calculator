library(pwrss)
library(plumber)

# 2 (independent), test obj = equality
#* @post /calculate
#* @param mu1:double
#* @param mu2:double
#* @param sd1:double
#* @param sd2:double
#* @param kappa:double
#* @param power:double
#* @param alpha:double
#* @param method:string
twoindepequality <- function(mu1, mu2, sd1, sd2, kappa = 1, power = 0.8, alpha = 0.05, method = "t") {
  if (method == "t") {
    result <- pwrss.t.2means(mu1, mu2, sd1, sd2, kappa, power, alpha, alternative = "not equal")
  } else {
    result <- pwrss.z.2means(mu1, mu2, sd1, sd2, kappa, power, alpha, alternative = "not equal")
  }
  list(n1 = result$n1, n2 = result$n2)
}

# Use these functions when number of groups is 2 (independent) and test objective is equality
# pwrss.t.2means(mu1 = 0.5, mu2 = 0.2, sd1 = 1, sd2 = 1, kappa = 1, 
#                power = .80, alpha = 0.05,
#                alternative = "not equal")
# 
# pwrss.z.2means(mu1 = 0.5, mu2 = 0.2, sd1 = 1, sd2 = 1, kappa = 1, 
#                power = .80, alpha = 0.05,
#                alternative = "not equal")
# 

